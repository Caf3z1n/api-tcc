import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import EspectadorController from './app/controllers/EspectadorController';
import SessionController from './app/controllers/SessionController';
import SolicitacaoPalestranteController from './app/controllers/SolicitacaoPalestranteController';
import AdminController from './app/controllers/AdminController';
import EventoControler from './app/controllers/EventoControler';
import SolicitacaoPalestraController from './app/controllers/SolicitacaoPalestraController';
import PalestraController from './app/controllers/PalestraController';
import FileController from './app/controllers/FileController';
import UserController from './app/controllers/UserController';
import EspectadorPalestraController from './app/controllers/EspectadorPalestraController';
import HomeEventosController from './app/controllers/HomeEventosController';
import AdminPalestrasController from './app/controllers/AdminPalestrasController';

import authMiddleware from './app/middlewares/auth';
import palestranteMiddleware from './app/middlewares/palestrante';
import adminMiddleware from './app/middlewares/admin';

const routes = Router();
const upload = multer(multerConfig);

/* SEM AUTENTICAÇÃO */
routes.get('/', (req, res) => res.send('API TCC funcionando!'));

routes.post('/espectador', EspectadorController.store);
routes.post('/solicitar-palestrante', SolicitacaoPalestranteController.store);
routes.post('/session', SessionController.store);

routes.get('/eventos', EventoControler.index);
routes.get('/home-eventos', HomeEventosController.index);

routes.post('/files', upload.single('file'), FileController.store);

/* ESPECTADOR */ routes.use(authMiddleware);
routes.get('/me', SessionController.index);
routes.put('/me', SessionController.update);

routes.post('/espectador-palestra', EspectadorPalestraController.create);
routes.get('/espectador-palestra', EspectadorPalestraController.index);
routes.get('/palestras/:palestraId', PalestraController.show);

/* PALESTRANTE */ routes.use(palestranteMiddleware);
routes.post('/solicitar-palestras', SolicitacaoPalestraController.store);
routes.put('/palestras/:palestraId', PalestraController.update);
routes.get('/palestras', PalestraController.index);
routes.delete('/palestras/:palestraId', PalestraController.delete);
routes.post('/palestras/:palestraId', PalestraController.create);

/* ADMIN */ routes.use(adminMiddleware);
routes.put(
  '/solicitar-palestrante/:palestranteId',
  SolicitacaoPalestranteController.update
);
routes.get('/solicitar-palestrante', SolicitacaoPalestranteController.index);
routes.post('/admin', AdminController.store);

routes.post('/eventos', EventoControler.store);
routes.put('/eventos/:eventoId', EventoControler.update);
routes.delete('/eventos/:eventoId', EventoControler.delete);

routes.get('/solicitar-palestras', SolicitacaoPalestraController.index);
routes.put(
  '/solicitar-palestras/:palestraId',
  SolicitacaoPalestraController.update
);

routes.get('/users', UserController.index);
routes.get('/admin-palestras', AdminPalestrasController.index);
routes.post('/admin', AdminController.store);

export default routes;
