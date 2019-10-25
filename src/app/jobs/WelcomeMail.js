import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { name, email, title, duration, finalDate, finalPrice, price } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Bem vindo ao Gympoint',
      template: 'welcome',
      context: {
        student: name,
        membership: title,
        duration,
        endDate: format(parseISO(finalDate), "'dia' dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        totalPrice: finalPrice,
        monthlyPrice: price,
      },
    });
  }
}

export default new WelcomeMail();
