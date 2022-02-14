export const queryFilters = <T>(object:T) => {
    let output: string = '';
    for (const [key, value] of Object.entries(object)) {
      (value || value == 0) &&
        (Array.isArray(value)
          ? value.length > 0 && (output += `${key}=${value.join(' ')}&`)
          : (output += `${key}=${value}&`));
    }
    return output.length > 0
      ? `?${output.substring(0, output.length - 1)}`
      : output;
  };