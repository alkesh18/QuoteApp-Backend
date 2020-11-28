var nodemailer = require('nodemailer');


class emailHelper {

  constructor(){

  }


  sendEmail = function(to, clientName, services , serviceTotalCost){

    console.log(services)

    const servicesArray = [...services]
    let servicesString = `
    <head>
    <style>
    #customers {
      font-family: Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    
    #customers td, #customers th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    
    #customers tr:nth-child(even){background-color: #f2f2f2;}
    
    #customers tr:hover {background-color: #ddd;}
    
    #customers th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #4CAF50;
      color: white;
    }
    </style>
    </head>
    <body>
    <table id="customers"> 
        <tr>
        <th>Description</th>
        <th>Materal Cost</th>
        <th>Hours</th>
        </tr>
    `;
    for(let s of servicesArray){
        servicesString += `
        <tr>
            <td>${s.description}</td>
            <td>$${s.materialCost}</td>
            <td>${s.hoursRequired}</td>
        </tr>
        `
    }
    servicesString += `</table></body><br/><br/>`
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'CapstoneProject2020.TB',
        pass: 'gzlotnpmvksngknb'
      }
    });

    var mailOptions = {
      from: 'CapstoneProject2020.TB@gmail.com',
      to: to,
      subject: 'Braceland Student Painting - Quote Report',

      html: `Dear ${clientName}, <br/><br/>
            This email is from Braceland Student Painting. <br/>
            Please see your selected service below: <br/><br/>
            ` + servicesString +
            `<b>Your quote total: $${serviceTotalCost}</b><br/><br/>
            Regards, <br/>Braceland Student Painting <br/><br/><hr>
            If you think this email was sent to you by mistake, Please ignore this email.
            `
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

}




module.exports = emailHelper