const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const axios = require('axios');

const router = express.Router();

// Configurar passport
passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });
  if (!user) return done(null, false, { message: 'Utilizador não encontrado' });

  const match = await bcrypt.compare(password, user.password);
  return match ? done(null, user) : done(null, false, { message: 'Password errada' });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Middleware para proteger rotas
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Rotas

router.get('/', (req, res) => res.redirect('/login'));

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();
  res.redirect('/login');
});

router.post('/login', (req, res, next) => {
  console.log("🔐 Login recebido:", req.body);
  next();
}, passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/login'));
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user, data: null, error: null });
});

router.post('/search', isAuthenticated, async (req, res) => {
  const query = req.body.query.trim().replace(/\s+/g, ' ');
  console.log("🔍 Pesquisa recebida:", query);

  const tmdbUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${process.env.TMDB_API_KEY}&language=pt-PT`;

  try {
    const tmdbRes = await axios.get(tmdbUrl);
    const movie = tmdbRes.data.results.find(item => item.media_type === 'tv' || item.media_type === 'movie');

    if (!movie) {
      return res.render('dashboard', {
        user: req.user,
        data: null,
        error: 'Filme ou série não encontrado.'
      });
    }

    const wikiTitle = movie.original_name || movie.original_title || movie.name || movie.title;
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    console.log("🌐 Wikipedia URL:", wikiUrl);

    let wikiData = null;
    try {
      const wikiRes = await axios.get(wikiUrl);
      wikiData = wikiRes.data;
    } catch {
      console.warn("⚠️ Wikipedia não encontrou a página. Vai sem resumo.");
    }

    req.user.searches.push(query);
    await req.user.save();

    res.render('dashboard', {
      user: req.user,
      data: {
        movie,
        wiki: wikiData
      },
      error: null
    });

  } catch (err) {
    console.error("❌ Erro geral:", err.message);
    res.render('dashboard', {
      user: req.user,
      data: null,
      error: 'Erro ao obter dados.'
    });
  }
});

module.exports = router;
