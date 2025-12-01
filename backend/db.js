// Temporary shim for legacy `db.query` calls during migration to MongoDB.
// This allows the server to start and produces clear errors for endpoints
// that haven't yet been migrated. Replace usages with Mongoose models.

module.exports = {
  query: function () {
    const args = Array.from(arguments);
    const last = args[args.length - 1];
    const err = new Error('Legacy SQL access attempted. This backend has been migrated to MongoDB — please convert this route to use Mongoose models.');
    if (typeof last === 'function') {
      // callback style: call callback with error
      return process.nextTick(() => last(err));
    }
    // promise style
    return Promise.reject(err);
  }
};
