// Layout components index file
import Footer from './Footer';
import Header from './Header';
import Layout from './Layout';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';

export { Footer, Header, Layout, MobileNav, Sidebar };

// Re-export all layout components as a single object for convenience
const LayoutComponents = {
  Layout,
  Header,
  Sidebar,
  Footer,
  MobileNav,
};

export default LayoutComponents;
