import Banner from "../../components/Banner/Banner";
import Card from "../../components/Card/Card";


function Home({apparts}) {
  return (
    <div className='home'>
      <Banner origin='home' />
      <div className='cards'>
        {apparts.map((appart) => (
          <Card
            key={appart.id}
            appart={appart}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;