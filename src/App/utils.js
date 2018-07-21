import fileSaver from "file-saver";
import forEach from "lodash/forEach";
export const decodeBase64 = string => atob(string);

export const getLength = value => value.length;

export const buildByteArray = string => {
  const stringLength = getLength(string);
  const buffer = new ArrayBuffer(stringLength);
  const array = new Uint8Array(buffer);
  forEach(string, (s, i) => {
    array[i] = string.charCodeAt(i);
  });
  return array;
};

export const createBlob = byteArray =>
  new Blob([byteArray], { type: "application/pdf" });

export const base64ToBlob = base64String => {
  const decodedString = decodeBase64(base64String);
  const byteArray = buildByteArray(decodedString);
  return byteArray ? createBlob(byteArray) : null;
};

export const download = (data, fileName) => {
  const blob = base64ToBlob(data);
  fileSaver.saveAs(blob, fileName);
};
