import { Principal } from '@dfinity/principal';
import Balance from '@components/Balance'
import { Header, Footer } from '@components/Common'
import Faucet from '@components/Faucet'
import Transfer from '@/components/Transfer'

type Props = {
  loggedInPrincipal: Principal
};

function App(props: Props) {

  return (
    <main>
      <Header />
      <Faucet userPrincipal={props.loggedInPrincipal} />
      <Balance userPrincipal={props.loggedInPrincipal} />
      <Transfer />
      <Footer />
    </main>
  );
}

export default App;
