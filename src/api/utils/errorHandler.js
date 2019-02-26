module.exports = (err, res) => {
  console.log(err)

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(400)
      .json({ error: 'Ce compte existe déjà' })
      .end()
  }

  return res
    .status(500)
    .json({ error: 'UNKNOWN' })
    .end()
}
