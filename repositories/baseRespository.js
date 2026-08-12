class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data, option = {}) {
    return await this.model.create(data, option);
  }

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findOne(options = {}) {
    return await this.model.findOne(options);
  }

  async update(id, data) {
    return await this.model.update(data, { where: { id } });
  }

  async delete(options = {}) {
    return await this.model.destroy(options);
  }

  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async findAndCountAll(options = {}) {
    return await this.model.findAndCountAll(options);
  }
}

const baseRespository = (model) => new BaseRepository(model);

module.exports = baseRespository;
