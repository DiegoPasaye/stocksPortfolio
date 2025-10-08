import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from "./admin.module.css";
import type { ReactNode } from 'react';


export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.bodyAdmin}>
      <nav className={styles.bodyAdminNav}>

        <div className={styles.sidebarHeader}>
          <Image src={'/stockLogo.svg'} alt='logo stock app' width={150} height={50} />
          <hr />
        </div>
        
        <div className={styles.sidebarLinks}>
          <Link href={'/admin'}><span>Usuarios</span></Link>
        </div>


      </nav>

      <main className={styles.panelAdmin}>
        {children}
      </main>
    </div>
  );
}