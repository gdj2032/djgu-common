import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'antd';
import { DemoModal, IDemoModalProps } from './src/DemoModal';
import { openModal, cmx } from '../.';
import { openModal2 } from './src/openModal2';

const App = () => {

  const open = () => {
    console.info('--- React.version --->', React.version);
    const { destroy } = openModal2<IDemoModalProps>(DemoModal, {
      afterClose: (isOk) => {
        destroy()
        if (isOk) {
          // ...
          console.info('--- openModal close --->', 'ok');
        }
      }
    })
  }
  return (
    <div>
      <span>{cmx.add(1, 2)}</span>
      <Button onClick={open}>open</Button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
