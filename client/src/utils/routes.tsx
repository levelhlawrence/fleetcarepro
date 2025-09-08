import { IoHomeSharp } from "react-icons/io5";
import { BsTruckFrontFill } from "react-icons/bs";
import { GrUserWorker } from "react-icons/gr";

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
    name: "vendors",
    icon: <GrUserWorker size={16} />,
    href: "vendors",
  },
];

export { navRoutes };
