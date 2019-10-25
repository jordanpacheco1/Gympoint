import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import MembershipController from './app/controllers/MembershipController';
import ActiveMembershipController from './app/controllers/ActiveMembershipController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.get('/memberships', MembershipController.index);
routes.post('/memberships', MembershipController.store);
routes.put('/memberships', MembershipController.update);
routes.delete('/memberships/:id', MembershipController.delete);

routes.get('/activememberships', ActiveMembershipController.index);
routes.post('/activememberships', ActiveMembershipController.store);
routes.put('/activememberships', ActiveMembershipController.update);
routes.delete('/activememberships/:id', ActiveMembershipController.delete);

export default routes;
