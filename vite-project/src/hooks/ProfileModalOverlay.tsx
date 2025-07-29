import { useNavigate } from "react-router-dom";
import { ProfileModal } from "../pages/Profile";

export const ProfileModalOverlay = () => {
  const navigate = useNavigate();

  return <ProfileModal onClose={() => navigate(-1)} />;
};
