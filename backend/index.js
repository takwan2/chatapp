const app = require('express')();
const server= require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*', methods: '*' }, } );
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Sequelize } = require('sequelize');
const userModel = require('./models/user');
const messageModel = require('./models/message');
const { verifyToken } = require('./middlewares/verifyToken');
// const bodyParser = require('body-parser');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.MYSQL_ROOT_HOST,
  username: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const User = userModel(sequelize);
const Message = messageModel(sequelize);

User.hasMany(Message, { foreignKey: 'sender' });
Message.belongsTo(User, { foreignKey: 'sender' });

// データベースとモデルの同期
sequelize.sync().then(() => {
  console.log('Database and tables synced!');
});

app.use(cors())
app.use(require('express').json())
// app.use(bodyParser.json());

app.get('/api/get-message', verifyToken, function(req, res){
  Message.findAll({
    include: [
      {
        model: User,
        attributes: ['username'],
        foreignKey: 'sender'
      }
    ],
    raw: true
  }).then(messages => {
    const formattedMessages = messages.map(message => {
      return {
        message: message.message,
        createdAt: message.createdAt,
        username: message['User.username']
      };
    });
    res.json(formattedMessages);
  }).catch(error => {
    console.error(error);
    res.status(500).json({ error: 'メッセージを取得できませんでした。'});
  });
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    //ユーザー名かパスワードが空の場合はエラー
    if (!username || !password) {
      return res.status(400).json({ error: 'ユーザー名とパスワードは入力必須です。' });
    }
    //入力されたユーザー名のユーザーがすでに存在している場合はエラー
    const user = await User.findOne({ where: { username: username } });
    if (user) {
      return res.status(400).json({ error: 'ユーザー名は既に使用されています。' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: req.body.username,
      password: hashedPassword
    });
    res.json({ message: 'ユーザーを作成しました。' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ユーザー作成中にエラーが発生しました。'});
  }
});


app.post('/api/login', async function(req, res){
  try {
    const { username, password } = req.body;
    //ユーザー名かパスワードが空の場合はエラー
    if (!username || !password) {
      return res.status(400).json({ error: 'ユーザー名とパスワードは入力必須です。' });
    }
    const user = await User.findOne({ where: { username: username} });
    if (!user) {
      return res.status(400).json({error: 'ユーザー名が違います。'}); 
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({error: 'パスワードが違います。'});
    }
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET)
    res.status(200).json({
      token: token,
      message: 'ログインに成功しました。'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ログイン中にエラーが起きました。'});
  }
});

app.get('*', (req, res) => res.status(404).send('ページは存在しません。'));
app.post('*', (req, res) => res.status(404).send('ページは存在しません。'));

io.on('connection', function(socket){
  socket.on('sendMessage', function(data) {
    if (!data.message) {
      socket.emit('error', '空のメッセージは送信できません。');
      return
    }
    Message.create({
        sender: data.userId,
        message: data.message,
    }).then(() => {
      io.emit('message', data);
    }).catch(e => {
      console.log(e)
      socket.emit('error', 'メッセージの保存に失敗しました');
    });
  });
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});	