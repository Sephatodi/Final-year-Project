// UI components index file
import Accordion from './Accordion';
import Chart from './Chart';
import DatePicker from './DatePicker';
import Dropdown, { DropdownDivider, DropdownHeader, DropdownItem } from './Dropdown';
import FileUpload from './FileUpload';
import ImageGallery from './ImageGallery';
import MapView from './MapView';
import Pagination from './Pagination';
import Tabs from './Tabs';
import Tooltip from './Tooltip';

// Re-export all UI components as a single object
const UIComponents = {
  Tabs,
  Accordion,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  DropdownHeader,
  Pagination,
  DatePicker,
  FileUpload,
  ImageGallery,
  MapView,
  Chart,
};

export default UIComponents;