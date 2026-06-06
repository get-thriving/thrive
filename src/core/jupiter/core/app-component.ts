function componentFromEventSource(source: string): string {
  if (source.includes("@")) {
    return source.split("@")[0];
  }
  if (source.includes(":")) {
    return source.split(":")[0];
  }
  return source;
}

function camelCaseToLabel(component: string): string {
  return component.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

export function appComponentName(source: string): string {
  const component = componentFromEventSource(source);
  return camelCaseToLabel(component);
}
