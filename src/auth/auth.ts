import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

// SIGNUP
export const signup = async (
  email: string,
  password: string
) => {
  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
};

// LOGIN
export const login = async (
  email: string,
  password: string
) => {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};

// LOGOUT
export const logout = async () => {
  return await signOut(auth);
};