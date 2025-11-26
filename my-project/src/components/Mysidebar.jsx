import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar";
import { Home, Mail, User } from "lucide-react";

export default function MySidebar() {
  const links = [
    { label: "Home", href: "/", icon: <Home /> },
    { label: "Contact", href: "/contact", icon: <Mail /> },
    { label: "About", href: "/about", icon: <User /> },
  ];

  return (
    <Sidebar>
      <SidebarBody>
        {links.map((l, i) => (
          <SidebarLink key={i} link={l} />
        ))}
      </SidebarBody>
    </Sidebar>
  );
}
