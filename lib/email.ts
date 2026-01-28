import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export const sendAdminNotification = async (type: 'booking' | 'consultation', data: any) => {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER;

    if (!adminEmail) {
        console.warn('ADMIN_EMAIL or EMAIL_SERVER_USER not set. Cannot send notification.');
        return;
    }

    let subject = '';
    let html = '';

    if (type === 'booking') {
        subject = `Нове бронювання: ${data.service?.name || 'Послуга'}`;
        html = `
      <h1>Нове бронювання на сайті Detailing4K</h1>
      <p><strong>Клієнт:</strong> ${data.clientName}</p>
      <p><strong>Телефон:</strong> ${data.clientPhone}</p>
      <p><strong>Email:</strong> ${data.clientEmail || 'Не вказано'}</p>
      <p><strong>Послуга:</strong> ${data.service?.name}</p>
      <p><strong>Дата:</strong> ${new Date(data.bookingDate).toLocaleDateString('uk-UA')}</p>
      <p><strong>Час:</strong> ${data.startTime}</p>
      <p><strong>Автомобіль:</strong> ${data.vehicleMake} ${data.vehicleModel}</p>
      <br/>
      <a href="https://detailing4k.com.ua/admin/bookings" style="background: #eab308; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Переглянути в адмінці</a>
    `;
    } else {
        subject = `Новий запит на консультацію від ${data.name}`;
        html = `
      <h1>Новий запит на консультацію</h1>
      <p><strong>Ім'я:</strong> ${data.name}</p>
      <p><strong>Телефон:</strong> ${data.phone || 'Не вказано'}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Повідомлення:</strong></p>
      <p>${data.message}</p>
      <br/>
      <a href="https://detailing4k.com.ua/admin/consultations" style="background: #eab308; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Переглянути в адмінці</a>
    `;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
            to: adminEmail,
            subject,
            html,
        });
        console.log(`Notification email sent for ${type}`);
    } catch (error) {
        console.error(`Error sending notification email for ${type}:`, error);
    }
};
