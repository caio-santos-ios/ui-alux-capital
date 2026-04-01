import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import 'react-toastify/dist/ReactToastify.css'; 
import { Autorization } from '@/components/autorization/Autorization';
import { Loading } from '@/components/loading/Loading';
import { Providers } from "./providers"; 
import { Modal403 } from '@/components/modal-403/Modal403';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Providers>
          <Loading />
          <Autorization /> 
          <Modal403 />
          {children}
        </Providers>
      </body>
    </html>
  );
}