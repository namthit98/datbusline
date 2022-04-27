import SidebarLayout from '../components/layouts/SidebarLayout';

const TicketPage = () => {
  return <h1>Tickets</h1>;
};

TicketPage.getLayout = function getLayout(page, token, setToken) {
  return (
    <SidebarLayout token={token} setToken={setToken}>
      {page}
    </SidebarLayout>
  );
};

export default TicketPage;
