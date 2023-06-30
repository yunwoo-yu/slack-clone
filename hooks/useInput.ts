import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T>(initialValue: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialValue);

  const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as T);
  }, []);

  return [value, changeHandler, setValue];
};

export default useInput;
