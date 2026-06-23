import api from "../config";

export const historyService = {
  async list() {
    const { data } = await api.get("/history");
    return data.history || [];
  },

  async create(result) {
    const { input } = result;
    const { data } = await api.post("/history", {
      rendaMensal: input.rendaMensal,
      custosMensais: input.custosMensais,
      result,
    });
    return data.history;
  },

  async remove(id) {
    await api.delete(`/history/${id}`);
  },
};
