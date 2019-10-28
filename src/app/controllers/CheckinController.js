import Checkin from '../models/Checkin';
import ActiveMembership from '../models/ActiveMembership';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll();

    return res.json(checkins);
  }

  async store(req, res) {
    const student_id = req.params.id;

    const activeMembershipExists = await ActiveMembership.findOne({
      where: { student_id: req.params.id },
    });

    if (!activeMembershipExists) {
      return res.status(404).json({ error: 'Student Not found' });
    }

    const checkins = await Checkin.findAndCountAll({
      where: { student_id: req.params.id },
    });

    if (checkins >= 5) {
      return res
        .status(501)
        .json({ error: `You can't checkin more than 5 days a week.` });
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
