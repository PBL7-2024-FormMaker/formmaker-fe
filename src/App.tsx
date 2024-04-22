import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';

import { useRouteElements } from '@/hooks/useRouteElements';

function App() {
  dayjs.extend(weekday);
  dayjs.extend(customParseFormat);
  const routeElements = useRouteElements();
  return <>{routeElements}</>;
}

export default App;
