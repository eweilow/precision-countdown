export function getDefaultPrefix(prefixForFuture) {
  let prefix = typeof prefixForFuture === "string" ? prefixForFuture : "in";
  
  if(prefix.trim().length === 0) return "";
  return `${prefix} `;
}