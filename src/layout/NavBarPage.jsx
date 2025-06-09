import { UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "../pages/loginpage";
import { adminLogout } from "../services/adminAuth/loginAuth";
import { removeUser } from "../utils/feature/userData";
import { useSnackbar } from "notistack";

const NavBarPage = () => {
  const [dropDown, setDropDown] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const {enqueueSnackbar}= useSnackbar()
  const dispatch = useDispatch()
  const admin = useSelector((state) => state.user);

  const dropdownRef = useRef();

  const handleDropDown = () => {
    setDropDown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchLogout = async () => {
    try {
      const res = await adminLogout();
      if (res) {
        dispatch(removeUser());
        enqueueSnackbar("logout successfully", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };

  return (
    <div className="w-full font-sans">
      <div className="bg-white shadow px-6 flex flex-col items-center">
        <div className="w-[90%] mx-auto flex items-center justify-between ">
          <div className="w-[100px]">
            <img
              src="https://freshcartdev.s3.eu-north-1.amazonaws.com/growvana_logo.png"
              alt="Growvana"
              className="h-auto w-full"
            />
          </div>

          <div className="relative cursor-pointer flex gap-2" ref={dropdownRef}>
            <UserRound
              className="w-5 h-5 hover:text-green-700"
              onClick={handleDropDown}
            />
            <h6 className=" font-bold">
              Welcome {admin?.name ? "Admin" : "Login Admin"}
            </h6>
            {dropDown && (
              <div className="absolute right-0 top-8 z-20 w-56 rounded border border-gray-300 bg-white shadow-md">
                {admin?.name ? (
                  <button
                    type="button"
                    onClick={fetchLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50  cursor-pointer"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLoginOpen(!loginOpen)}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50  cursor-pointer"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
};

export default NavBarPage;
