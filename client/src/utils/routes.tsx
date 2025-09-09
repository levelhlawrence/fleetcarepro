import { IoHomeSharp } from "react-icons/io5";
import { BsTruckFrontFill } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";
import { FaTools } from "react-icons/fa";

const navRoutes = [
  {
    name: "home",
    icon: <IoHomeSharp size={16} />,
    href: "",
  },
  {
    name: "vehicles",
    icon: <BsTruckFrontFill size={16} />,
    href: "vehicles",
  },
  {
    name: "work orders",
    icon: <FaTools size={16} />,
    href: "work-orders",
  },
  {
    name: "vendors",
    icon: <GrUserWorker size={16} />,
    href: "vendors",
  },
];

export { navRoutes };
