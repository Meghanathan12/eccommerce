from flask import *
import mysql.connector
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import os
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import pymysql
import jwt
import datetime
from functools import wraps
from flask_mail import Mail, Message
app = Flask(__name__)
CORS(app)  
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'meghanathan2004@gmail.com'  
app.config['MAIL_PASSWORD'] = 'rpwc qhgc kqtx jkox'          
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)  
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['secret_key'] = 'this is secret'
UPLOAD_FOLDER = './static/upload'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
otp_store = {}
def connect():
  return  mysql.connector.connect(
  host="localhost",
  user="root",
  password="1212",
  port="3308",
  database="hotel"
)
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            bearer = request.headers['Authorization']
            if bearer.startswith("Bearer "):
                token = bearer.split(" ")[1]
        if not token:
            return jsonify({'error': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, app.config['secret_key'], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token!'}), 401
        return f( *args, **kwargs)
    return decorated
@app.route('/access', methods=['POST'])
@token_required
def access():
    return jsonify({'message': f'Welcome user, you have access!'})
@app.route('/access1', methods=['POST'])
@token_required
def access1():
    return jsonify({'message': f'Welcome admin, you have access!'})
@app.route('/new', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER)
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/new".join([target, filename])
    file.save(destination)
    return file.filename
@app.route("/",methods=["POST"])   
def register():
    r = request.json
    conn = connect()  
    mycursor = conn.cursor(dictionary=True)
    mycursor.execute("SELECT * FROM user WHERE email = %s", (r["email"],))
    existing_user = mycursor.fetchone()
    if existing_user:
        conn.close()
        return "user mail already existed"
    mycursor.execute("""
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100),
            password VARCHAR(100),
            mobile VARCHAR(100),
            role VARCHAR(100),
            email VARCHAR(100)
        )
    """)
    conn.commit()
    mycursor.execute("""
        INSERT INTO user (name, password, mobile, role, email)
        VALUES (%s, %s, %s, %s, %s)
    """, (r["name"], r["pas"], r["mobile"], "user", r["email"]))
    conn.commit()
    conn.close()
    return "stored successfully"
@app.route("/one",methods=["POST"])   
def login():
    j=request.json
    conn=connect()
    mycursor=conn.cursor()
    mycursor.execute("select*from user where email=%s and password=%s",(j["email"],j["pas"]))
    n=mycursor.fetchone()
    print(n)
    if len(n)!=0:
        token = jwt.encode({
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
        }, app.config['secret_key'], algorithm="HS256")
        token = token if isinstance(token, str) else token.decode('utf-8')
        print(token)
        return jsonify(n,{'token': token})
    return "user doesn't exist"
@app.route("/add",methods=["POST"])   
def add():
    r = request.json
    conn = connect()
    mycursor = conn.cursor()
    mycursor.execute("SELECT * FROM products WHERE pname = %s", (r["pname"],))
    existing_user = mycursor.fetchone()
    if existing_user:
        conn.close()
        return "product already existed"
    mycursor.execute("CREATE TABLE IF NOT EXISTS products(pid INTEGER PRIMARY KEY AUTO_INCREMENT, pname VARCHAR(100), quantity VARCHAR(100),price integer,pimagename varchar(100))")
    conn.commit()
    mycursor.execute("INSERT INTO products (pname, quantity,price,pimagename) VALUES (%s, %s,%s,%s)", (r["pname"], r["quan"],r["price"],r["file"]))
    conn.commit()
    conn.close()
    return 'stored successfully'
@app.route("/image",methods=["POST"])   
def image():
    conn = connect()
    mycursor = conn.cursor()
    mycursor.execute("select*from products")
    n=mycursor.fetchall()
    print(n)
    return json.dumps(n)
@app.route("/three",methods=["POST"])   
def cart():
    r=request.json
    conn = connect()
    mycursor = conn.cursor()
    mycursor.execute("CREATE TABLE IF NOT EXISTS cart(cid INTEGER PRIMARY KEY AUTO_INCREMENT, pid integer,pname varchar(100), quantity VARCHAR(100),price integer,pimagename varchar(100),uid integer)")
    conn.commit()
    mycursor.execute("INSERT INTO cart(pid,pname, quantity,price,pimagename,uid) VALUES (%s, %s,%s,%s,%s,%s)", (r["id"],r["name"], r["quan"],r["price"],r["image"],r["uid"]))
    conn.commit()
    conn.close()
    return"sucess"
@app.route("/four",methods=["POST"])   
def show():
    r=request.json
    conn = connect()
    mycursor = conn.cursor()
    mycursor.execute("select*from cart where uid=%s ",(r['id'],))
    n=mycursor.fetchall()
    print(n)
    return json.dumps(n)
@app.route("/five",methods=["POST"])   
def carts():
    r=request.json
    conn = connect()
    mycursor = conn.cursor()
    mycursor.execute("select*from cart where uid=%s ",(r['id'],))
    n=mycursor.fetchall()
    return json.dumps(n)
@app.route("/delcart",methods=["POST"])   
def delcart():
    r=request.json
    conn = connect()
    mycursor = conn.cursor()
    mycursor.execute("delete  from cart where cid=%s",(r['id'],))
    conn.commit()
    return "removed from cart"
@app.route("/clearcart",methods=["POST"])   
def clearcart():
    r=request.json
    conn = connect()
    mycursor = conn.cursor()
    mycursor.execute("delete  from cart where uid=%s",(r['id'],))
    conn.commit()
    return jsonify(1)
def generate_bill(order_id, output_filename="bill.pdf"):
    from datetime import datetime
    conn = connect()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT o.oid as order_id, o.totalbill, o.ordereddate as order_date, o.deliverydate,
               u.name, u.email, u.mobile
        FROM orders o
        JOIN user u ON o.uid = u.id
        WHERE o.oid = %s
    """, (order_id,))
    order_info = cursor.fetchone()
    cursor.execute("""
        SELECT p.pname as name, od.quantity, od.unitprice as price, od.totalprice
        FROM orderdetails od
        JOIN products p ON od.productid = p.pid
        WHERE od.oid = %s
    """, (order_id,))
    items = cursor.fetchall()
    conn.close()
    order_date = datetime.strptime(order_info['order_date'], '%Y-%m-%d')
    delivery_date = datetime.strptime(order_info['deliverydate'], '%Y-%m-%d')
    c = canvas.Canvas(output_filename, pagesize=A4)
    width, height = A4
    y = height - inch
    def draw_header():
        nonlocal y
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, y, "INVOICE")
        y -= 30
        c.setFont("Helvetica", 12)
        c.drawString(50, y, f"Bill To: {order_info['name']}")
        y -= 20
        c.drawString(50, y, f"Email: {order_info['email']}")
        y -= 20
        c.drawString(50, y, f"Mobile: {order_info['mobile']}")
        y -= 20
        c.drawString(50, y, f"Order ID: {order_info['order_id']}")
        y -= 20
        c.drawString(50, y, f"Order Date: {order_date.strftime('%Y-%m-%d')}")
        y -= 20
        c.drawString(50, y, f"Delivery Date: {delivery_date.strftime('%Y-%m-%d')}")
        y -= 30
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Product")
        c.drawString(250, y, "Price")
        c.drawString(350, y, "Quantity")
        c.drawString(450, y, "Total")
        y -= 20
        c.line(50, y, 550, y)
        y -= 20
    draw_header()
    c.setFont("Helvetica", 12)
    for item in items:
        if y < 100:  
            c.showPage()
            y = height - inch
            draw_header()
        c.drawString(50, y, item['name'])
        c.drawString(250, y, f"{float(item['price']):.2f}")
        c.drawString(350, y, str(item['quantity']))
        c.drawString(450, y, item['totalprice'])
        y -= 20
    if y < 100:
        c.showPage()
        y = height - inch
        draw_header()
    y -= 10
    c.line(50, y, 550, y)
    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(350, y, "Grand Total:")
    c.drawString(450, y, order_info['totalbill'])
    y -= 50
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, y, f"Generated on {order_date.strftime('%Y-%m-%d')}")
    c.save()
    print(f"Invoice generated: {output_filename}")
def send_email_with_attachment(subject, body,to_email,name, file_path):
    sender_email = "meghanathan2004@gmail.com"
    app_password = "dytlsnpoialsrweg"  
    body = f"""
Dear {name},

Thank you for your recent order with MSD&CO. 

Please find attached the official bill for your order. Kindly review it at your convenience.

If you have any questions or require further assistance, please do not hesitate to contact our customer support team.

We appreciate your business and look forward to serving you again.

Best regards,
MSD&CO Customer Service Team
"""    
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))
    if file_path and os.path.isfile(file_path):
        with open(file_path, "rb") as f:
            part = MIMEApplication(f.read(), Name=os.path.basename(file_path))
        part['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
        msg.attach(part)
    else:
        print("Attachment file not found or invalid path.")
        return
    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, app_password)
        server.send_message(msg)
        server.quit()
        print("Email sent successfully with attachment.")
    except Exception as e:
        print("Failed to send email:", e)
@app.route("/order", methods=["POST"])
def order():
    r = request.json
    uid = r["id"]
    print(uid)
    pid =r["details"]["totalPrice"]
    products_list = r["products"]
    conn = connect()
    mycursor = conn.cursor()
    # Create orders table if not exists
    mycursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            oid INTEGER PRIMARY KEY AUTO_INCREMENT,
            uid INTEGER,
            totalbill varchar(100),
            ordereddate VARCHAR(100),
            deliverydate VARCHAR(100),
            status varchar(100)
        )
    """)
    conn.commit()
    # Insert into orders table
    mycursor.execute(
    'INSERT INTO orders (uid, totalbill, ordereddate, deliverydate, status) VALUES (%s, %s, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), %s)',
    (uid, str(pid), "pending")
)

    last_oid = mycursor.lastrowid
    conn.commit()
    # Create orderdetails table with productid, quantity, unitprice, totalprice
    mycursor.execute("""
        CREATE TABLE IF NOT EXISTS orderdetails (
            odid INTEGER PRIMARY KEY AUTO_INCREMENT,
            uid INTEGER,
            oid INTEGER,
            productid INTEGER,
            quantity INTEGER,
            unitprice VARCHAR(100),
            totalprice VARCHAR(100),
            FOREIGN KEY (oid) REFERENCES orders(oid)
        )
    """)
    conn.commit()
    # Insert each product into orderdetails
    for product in products_list:
        product_id = product["pid"]
        quantity = product["quantity"]
        unit_price = float(product["unitPrice"])
        total_price = quantity * unit_price
        mycursor.execute(
            "INSERT INTO orderdetails (uid, oid, productid, quantity, unitprice, totalprice) VALUES (%s, %s, %s, %s, %s,%s)",
            (uid, last_oid, product_id, quantity, str(unit_price), str(total_price))
        )
    conn.commit()
    conn.close()
    conn = connect()
    mycursor = conn.cursor(dictionary=True)
    mycursor.execute("""
        SELECT  email,name
        FROM 
        user 
        WHERE id = %s
    """, (uid,))
    email = mycursor.fetchone()
    generate_bill(order_id=last_oid, output_filename="sample_invoice.pdf")
    send_email_with_attachment(subject="BILL COPY", body="THANKS FOR PURCHASING AND YOUR BILL COPY IS ATTACHED BELOW", to_email=email["email"], name=email["name"],file_path="sample_invoice.pdf")
    return "success"
@app.route("/take", methods=["POST"])
def take():
    r = request.json
    if r["id"]==1:
        conn = connect()
        mycursor = conn.cursor()
        mycursor.execute("select*from orderdetails")
        n=mycursor.fetchall()
        return json.dumps(n)
    else:
        return 'id not same'
@app.route("/display", methods=["POST"])
def display_orders():
    conn = connect()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.id, u.name, u.email, u.mobile, o.oid, o.ordereddate, o.deliverydate, o.totalbill
        FROM user u
        JOIN orders o ON o.uid = u.id
        WHERE o.status = 'pending'
    """)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(result)
@app.route("/items",methods=["POST"])
def items():
    r = request.json
    conn=connect()
    mycursor = conn.cursor(dictionary=True)
    mycursor.execute("""
    SELECT o.oid, o.productid, o.quantity, o.unitprice, o.totalprice, p.pname 
    FROM hotel.orderdetails o 
    JOIN hotel.products p ON o.productid = p.pid 
    WHERE o.oid = %s
""", (r['id'],))
    n=mycursor.fetchall()
    return json.dumps(n)
def send_email(to_email, subject, body):
    from_email = "meghanathan2004@gmail.com"
    from_password = "dytlsnpoialsrweg"
    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(from_email, from_password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print("Error sending email:", e)
@app.route("/order-action", methods=["POST"])
def order_action():
    data = request.json
    print(data)
    oid = data["i"]
    action = data["a"]  # accept / decline
    email = data["e"]
    
    status = "accepted" if action == "accept" else "declined"

    conn = connect()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status=%s WHERE oid=%s", (status, oid))
    conn.commit()
    conn.close()

    subject = f"Order {action.capitalize()} - MSD & Co"
    message_detail = {
        "accept": "Your order is confirmed and will be delivered soon.",
        "decline": "Unfortunately, we cannot process your order at this time."
    }[action]

    body = f"""Dear Customer,
We would like to inform you that your order (Order ID: {oid}) has been {action}ed.

{message_detail}

Thank you for shopping with MSD & Co.
Warm regards,  
MSD & Co Team
"""
    send_email(email, subject, body)
    return jsonify({"message": f"Order {action}ed and customer notified."})

@app.route("/ecomm", methods=["POST"])
def get_accepted_orders():
        r = request.json
        print(r)
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
    SELECT u.id, u.name, u.email, u.mobile,
           o.oid, o.ordereddate, o.deliverydate, o.totalbill
    FROM hotel.user u
    JOIN hotel.orders o ON o.uid = u.id
    WHERE o.status = %s
""", (r["status"],))
        n=cursor.fetchall()
        print(n)
        return jsonify(n)
@app.route("/ecom", methods=["POST"])
def get_acceptedorders():
        r = request.json
        print(r)
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
    SELECT u.id, u.name, u.email, u.mobile,
           o.oid, o.ordereddate, o.deliverydate, o.totalbill
    FROM hotel.user u
    JOIN hotel.orders o ON o.uid = u.id
    WHERE o.status = %s
""", (r["status"],))
        n=cursor.fetchall()
        print(n)
        return jsonify(n)
@app.route("/accept",methods=["POST"])
def accept():
    r = request.json
    conn=connect()
    mycursor = conn.cursor(dictionary=True)
    mycursor.execute("select o.oid,o.quantity,o.unitprice,o.totalprice,p.pname from hotel.orderdetails o join hotel.products p on o.productid=p.pid where o.oid=%s",(r['oid'],))
    n=mycursor.fetchall()
    return json.dumps(n)
@app.route("/reject",methods=["POST"])
def reject():
    r = request.json
    conn=connect()
    mycursor = conn.cursor(dictionary=True)
    mycursor.execute("select o.oid,o.quantity,o.unitprice,o.totalprice,p.pname from hotel.orderdetails o join hotel.products p on o.productid=p.pid where o.oid=%s",(r['oid'],))
    n=mycursor.fetchall()
    return json.dumps(n)
@app.route("/send-otp", methods=['POST'])
def send_otp():
    r = request.json
    print(r)
    email = r["email"]
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    conn = connect()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
    user = cursor.fetchone()
    if user:
        otp = str(random.randint(100000, 999999))
        otp_store[email] = otp
        msg = Message(
            'Your OTP Code',
            sender=app.config['MAIL_USERNAME'],  
            recipients=[email]
        )
        msg.html = f"""
        <p>Dear {user['name']},</p>
        <p>We have received a request to reset your password for your MSD&amp;CO account.</p>
        <p>Your One-Time Password (OTP) for verification is: <strong>{otp}</strong></p>
        <p>Please enter this OTP to proceed with resetting your password. For your security, do not share this OTP with anyone.</p>
        <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
        <p>Thank you for choosing MSD&amp;CO.</p>
        <p>Best regards,<br>MSD&amp;CO Support Team</p>
        """

        mail.send(msg)
        print("success")
        return jsonify({'message': 'OTP sent successfully'})
    else:
        print("failed")
        return jsonify({'message': 'Please enter your registered email ID'})
        
@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get("email")
    entered_otp = data.get("otp")
    if otp_store.get(email) == entered_otp:
        return jsonify({"message": "OTP verified"})
    return jsonify({"error": "Invalid OTP"}), 400
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    con = connect()
    cur = con.cursor()
    cur.execute("UPDATE user SET password=%s WHERE email=%s", (password, email))
    con.commit()
    con.close()
    if email in otp_store:
        del otp_store[email]
    return jsonify({"message": "Password updated successfully"})
@app.route("/removeproduct", methods=["POST"])
def remove_product():
    data = request.json
    product_id = data["id"]
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE pid = %s", (product_id,))
    conn.commit()
    return jsonify({"message": "Product removed"})
if __name__ == "__main__":
    app.run(debug=True)