import * as Yup from 'yup';
import Membership from '../models/Membership';

class ActiveMembershipController {
  async index(req, res) {
    const memberships = await Membership.findAll();

    return res.json(memberships);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const membershipExists = await Membership.findOne({
      where: { title: req.body.title },
    });

    if (membershipExists) {
      return res.status(400).json({ error: 'Membership Plan already exists' });
    }

    const { id, title, duration, price } = await Membership.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const membership = await Membership.findByPk(req.membershipId);

    const { id, title, duration, price } = await membership.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const membership = await Membership.findByPk(req.params.id);

    try {
      await membership.destroy();
      return res.status(200).json({ success: 'Plano deletado com sucesso' });
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Houve um erro ao tentar remover o plano.' });
    }
  }
}

export default new ActiveMembershipController();
