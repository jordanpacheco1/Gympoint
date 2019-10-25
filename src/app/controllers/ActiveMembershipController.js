import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import ActiveMembership from '../models/ActiveMembership';
import Membership from '../models/Membership';
import Student from '../models/Student';

import WelcomeMail from '../jobs/WelcomeMail';
import Queue from '../../lib/Queue';

class ActiveMembershipController {
  async index(req, res) {
    const activememberships = await ActiveMembership.findAll();

    return res.json(activememberships);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Checks if Student is already enrolled
     */

    const activeMembershipExists = await ActiveMembership.findOne({
      where: { student_id },
    });

    if (activeMembershipExists) {
      return res.status(400).json({ error: 'Student already enrolled' });
    }

    /**
     * Calculates the end_date and price according to start_date
     */

    const selectedMembership = await Membership.findOne({
      where: {
        id: plan_id,
      },
    });

    const enrolledStudent = await Student.findOne({
      where: {
        id: student_id,
      },
    });

    const { name, email } = enrolledStudent.dataValues;

    const { title, duration, price } = selectedMembership.dataValues;

    const finalDate = addMonths(parseISO(start_date), duration);

    const finalPrice = price * duration;

    const enrollment = await ActiveMembership.create({
      student_id,
      plan_id,
      start_date,
      end_date: finalDate,
      price: finalPrice,
    });

    await Queue.add(WelcomeMail.key, {
      name,
      email,
      title,
      duration,
      finalDate,
      finalPrice,
      price,
    });

    return res.json(enrollment);
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
