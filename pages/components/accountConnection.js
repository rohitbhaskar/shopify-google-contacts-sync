import React, {useCallback, useState} from 'react';
import { AccountConnection, Link } from '@shopify/polaris';
import axios from 'axios'

export default function AccountConnectionExample() {
  const [connected, setConnected] = useState(false);
  const [url, setUrl] = useState('');

  const accountName = connected ? 'Google' : '';
  
  const handleAction = useCallback(() => {
    const newConnected = !connected;
    if(connected === false){
      let match = document.cookie.match(new RegExp("(^| )" + shopOrigin + "=([^;]+)"));
      let shopOrigin =  match ? match[2] : "";
      axios.get('/google', {
        params: {
          store: shopOrigin
        }
      })
      .then(response => {
        //console.log(response);
        if(response.data && response.data.includes('http')) {
          //window.location.replace(response.data);
          //window.open(response.data, '_blank');
          var left = (screen.width/2)-(600/2);
          var top = (screen.height/2)-(600/2);
          window.open(response.data, 'popup','width=600,height=600,scrollbars=no,resizable=no,top='+top+',left='+left);
        }
      });

    }
    setConnected((connected) => !connected);
  }, [connected]);

  const buttonText = connected ? 'Disconnect' : 'Connect';
  const details = connected ? 'Account connected' : 'No account connected';
  const terms = connected ? null : (
    <p>
      By clicking <strong>Connect</strong>, you agree to accept Google Contacts Sync’s{' '}
      <Link url="#">terms and conditions</Link>. You’ll then be able to sync orders to google contacts.
    </p>
  );
  
  return (
    <AccountConnection
      accountName={accountName}
      connected={connected}
      title="Google Contacts"
      action={{
        content: buttonText,
        onAction: handleAction,
      }}
      details={details}
      termsOfService={terms}
    />
  );
}