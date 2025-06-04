export const isElectron = () => {
  return !!(window as any).electronAPI;
};

export const getEnvironment = () => {
  if (isElectron()) {
    return 'electron';
  }
  return 'web';
};