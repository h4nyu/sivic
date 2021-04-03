import { observable } from "mobx";

export type LoadingStore = {
  isActive: boolean
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
};
export const LoadingStore = (): LoadingStore => {
  let pendingNum = 0;
  const isActive = () => pendingNum > 0;
  const loading = async <T>(fn: () => Promise<T>) => {
    try {
      pendingNum = pendingNum + 1;
      self.isActive = isActive();
      return await fn();
    } finally {
      pendingNum = pendingNum - 1;
      self.isActive = isActive();
    }
  };
  const self = observable({
    isActive: false,
    loading,
  });
  return self
};
