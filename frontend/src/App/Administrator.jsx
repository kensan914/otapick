import { useLocationAdmin } from "~/hooks/useLocationAdmin";
import { useScrollAdmin } from "~/hooks/useScrollAdmin";

export const Administrator = ({ children }) => {
  useLocationAdmin();
  useScrollAdmin();

  return children;
};
