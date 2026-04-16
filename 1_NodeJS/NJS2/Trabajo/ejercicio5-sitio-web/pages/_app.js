import '../styles/globals.css';
import Menu from '../modules/Menu';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Menu />
      <Component {...pageProps} />
    </>
  );
}
