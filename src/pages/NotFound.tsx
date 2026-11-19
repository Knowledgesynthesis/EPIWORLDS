import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { buttonClasses } from '../components/ui/buttonClasses';

export default function NotFound() {
  return (
    <div>
      <PageHeader title="Page not found">That address does not exist — it may have moved.</PageHeader>
      <div className="flex flex-wrap gap-3">
        <Link to="/" className={buttonClasses('default', 'md')}>Home</Link>
        <Link to="/learn" className={buttonClasses('outline', 'md')}>Course map</Link>
      </div>
    </div>
  );
}
