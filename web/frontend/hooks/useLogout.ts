"use client"

import { customAxios } from "@/axios/customAxios";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.user);

  const loginout = useCallback(async (allDevices : boolean = false, redirect: boolean = true) => {
    if(redirect) router.replace("/connexion");
    
    dispatch({ type: "user/flush" });
    
    if(token) {
      await customAxios.post("/logout", {"all-devices": allDevices}, {
        headers : {
          "Authorization" : "Bearer " + token
        }
      });
    }
    
  }, [dispatch, router, token]);

  return loginout
}