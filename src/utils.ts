  export function capitalizeStr(str: string) {
    let result: string;
    result = str.charAt(0).toLocaleUpperCase() + str.slice(1);
    return result;
  }