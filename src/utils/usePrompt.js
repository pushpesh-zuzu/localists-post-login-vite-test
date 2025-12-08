// utils/usePrompt.js
import { useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import { useContext } from "react";

export const usePrompt = (message, when) => {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    const confirmNavigation = (...args) => {
      const confirm = window.confirm(message);
      if (confirm) {
        navigator.push = push; // reset
        push(...args);
      }
    };

    navigator.push = confirmNavigation;

    return () => {
      navigator.push = push; // cleanup
    };
  }, [message, when, navigator]);
};
