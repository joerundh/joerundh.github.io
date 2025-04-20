import { toDashedLowerCase, toCamelCase, randomAlphanumerical } from "./strings.mjs";

/*
Defines an object that holds the name of the storage, 
the prefixable name based on that name, the key list, 
and the list of properties that all stored objects 
should have (additional properties may be added 
manually later).

Usage:

With the name of a storage in a string name and the property
names of the stored objects in an array properties, 

const storage = storageExists(name) 
                    ? openObjectStorage(name)
                    : createObjectStorage(names)

*/

export function ObjectStorage(name, objectProperties) {
    this.name = `${name}`;
    this.prefix = toDashedLowerCase(name);
    this.keyList = JSON.parse(localStorage.getItem(`${this.prefix}-key-list`)) || [];
    this.objectProperties = objectProperties || [];


    /*
    Short-hand functions (not prototype functions), only to 
    be used by the prototype functions to add, remove or check 
    for keys.
    
    After every change of the list, the Storage 
    object is saved to the local storage.
    */

    const generateKey = () => randomAlphanumerical(16);

    const hasKey = key => {
        /*
        If the parameter key is defined, true is returned if 
        the key list contains its value. In any other case,
        false is returned.
        */
        if (key) {
            return this.keyList.includes(key);
        }
        return false;
    }

    const addKey = key => {
        /*
        Takes a key value, and inserts it into the list if 
        the value is not already in the list, and returns true.
        If the list already contains the given key, nothing is
        done except returning false.
        */
        if (hasKey(key)) {
            return false;
        }
        this.keyList.push(key);
        saveKeys();
        return true;
    }

    const saveKeys = () => {
        /*
        Saves the key list to local storage
        */
        localStorage.setItem(`${this.prefix}-key-list`, JSON.stringify(this.keyList));
    }

    const deleteKey = key => {
        /*
        Takes a key and removes it from the key list. If successful 
        (i.e. the list contains the key), true is returned; otherwise,
        false is returned.
        */
        if (hasKey(key)) {
            this.keyList.splice(this.keyList.indexOf(key), 1);
            saveKeys();
            return true;
        }
        return false;
    }


    /*
    Prototype properties and functions to 
    */

    this.length = function() { return this.keyList.length; }

    this.addObject = function(values) {
        /*
        Creates an object with the properties defined 
        in the Storage object, and with the values 
        passed as parameters, along with a randomly
        generated key, which is used to store the object
        in local storage
        */

        /*
        Create object and add key property
        */
        const obj = {};
        let key;
        while (hasKey(key = generateKey()));
        obj.objectStorageKey = key;
        obj.timeAdded = Date.now();

        /*
        Add pre-defined properties with given values
        */
        for (let i in this.objectProperties) {
            obj[this.objectProperties[i]] = values.at(i);
        }

        /*
        Store the object in local storage and the key in
        the key list
        */
        addKey(obj.objectStorageKey);
        saveKeys();
        localStorage.setItem(`${this.prefix}-${obj.objectStorageKey}`, JSON.stringify(obj));

        /*
        Return the object
        */
        return obj;
    };

    this.getObject = function() {
        /*
        Returns a parsed object from local storage, given a key
        that exists in the key list; if the key is not in the 
        key list, a null object is returned.
        */
        if (hasKey(key)) {
            return JSON.parse(localStorage.getItem(`${this.prefix}-${key}`));
        }
        return null;
    };
    
    this.getAllObjects = function() {
        /*
        Calls getObject() for all the keys in the key list
        and returns the resulting array of stored objects.
        */
        return this.keyList.map(key => JSON.parse(localStorage.getItem(`${this.prefix}-${key}`)));
    };

    this.saveObject = function(obj) {
        /*
        Takes a created object and saves it to local storage,
        as long as its key is to be found in the key list, and 
        returns false; otherwise, false is returned.
        */
        if (obj.objectStorageKey && hasKey(obj.objectStorageKey)) {
            localStorage.setItem(`${this.prefix}-${obj.objectStorageKey}`, JSON.stringify(obj));
            return true;
        }
        return false;
    };
    
    this.deleteObject = function(key) {
        /*
        Takes an object's storage key and deletes it from local 
        storage, if the key can be found in the key list, and 
        returns true; otherwise, false is returned.
        */
        if (deleteKey(key)) {
            localStorage.removeItem(`${this.prefix}-${key}`);
            return true;
        }
        return false;
    };

    this.deleteAllObjects = function() {
        /*
        Calls deleteObject() for all keys in the key list
        */
        this.keyList.forEach(key => {
            this.deleteObject(key);
        });
    };

    this.searchForValue = function(keyword, value) {
        /*
        Searches through the objects and returns the ones whose
        value of the given keyword matches the primitive value
        provided. This assumes that the sought-after object value
        is primitive
        */
    
        return this.getAllObjects().filter(obj => {
            if (typeof value === "object") {
                return false;
            }
            if (obj[keyword]) {
                if (obj[keyword] instanceof Array) {
                    return obj[keyword].includes(value);
                } else {
                    return obj[keyword] === value || new RegExp(value, "g").test(obj[keyword]);
                }
            } else {
                return false;
            }
        });
    }
}