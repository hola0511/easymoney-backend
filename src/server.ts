import { app } from './app';

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.info(`EasyMoney API running on port ${port}`);
});
