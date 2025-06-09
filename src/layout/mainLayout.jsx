import { Outlet, useNavigate } from "react-router-dom";
import NavBarPage from "./NavBarPage";
import { useDispatch, useSelector } from "react-redux";
import { adminProfile } from "../services/adminAuth/loginAuth";
import { useEffect, useState } from "react";
import { addUser } from "../utils/feature/userData";

const MainLayout = () => {
  const admin = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true); // Track profile fetch status

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await adminProfile();

        if (res?.data) {
          dispatch(addUser(res.data));
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!admin?.name) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [admin?.name, dispatch]);

  useEffect(() => {
    if (!loading && !admin?.name) {
      navigate("/login");
    }
  }, [loading, admin?.name, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBarPage />
      <Outlet />
    </div>
  );
};

export default MainLayout;
