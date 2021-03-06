export class StorageTools {
  static getJsonSafely<T>(key: string): T {
    const r1 = localStorage.getItem(key);
    if (r1 !== undefined) {
      try {
        const r2 = JSON.parse(r1);
        if (r2 === null) {
          return undefined;
        } else {
          return r2 as T;
        }
      } catch {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  static setJson<T>(key: string, val?: T) {
    if (val === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(val));
    }
  }
  static getArraySafely<T>(key: string): T[] {
    const r1 = localStorage.getItem(key);
    if (r1 !== undefined) {
      try {
        const r2 = JSON.parse(r1);
        if (r2 === null) {
          return [];
        } else {
          return r2 as T[];
        }
      } catch {
        return [];
      }
    } else {
      return [];
    }
  }
  static setArray<T>(key: string, val?: T[]) {
    if (val === undefined || val.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(val));
    }
  }
  static getBooleanSafely(key: string) {
    const r1 = localStorage.getItem(key);
    if (r1 !== undefined) {
      return r1 === '1';
    } else {
      return false;
    }
  }
  static setBoolean(key: string, val?: boolean) {
    if (val === true) {
      localStorage.setItem(key, '1');
    } else {
      localStorage.removeItem(key);
    }
  }
  static getStringSafely(key: string) {
    const r1 = localStorage.getItem(key);
    if (r1 !== undefined) {
      return r1 as string;
    } else {
      return undefined;
    }
  }
  static setString(key: string, val?: string) {
    if (val !== undefined) {
      localStorage.setItem(key, val);
    } else {
      localStorage.removeItem(key);
    }
  }
  static getNumberSafely(key: string) {
    const r1 = localStorage.getItem(key);
    if (r1 !== undefined) {
      let r2 = parseFloat(r1);
      return isNaN(r2)? undefined : r2;      
    } else {
      return undefined;
    }
  }
  static setNumber(key: string, val?: number) {
    if (val !== undefined) {
      localStorage.setItem(key, val.toString());
    } else {
      localStorage.removeItem(key);
    }
  }
}
