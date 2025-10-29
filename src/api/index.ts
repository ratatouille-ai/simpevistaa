const PROJECT_KEY = "0f3f0bb0a0a62250c16fc6aaf2525160";

const N8N_WEBHOOKS = {
  SQL_QUERY: "https://n8n.ridaflows.com/webhook/endpoint",
  RATATOUILLE_CHAT: "https://n8n.ridaflows.com/webhook/ratatouille-chat",
};
class RatatouilleApi {
  async doQuery(query: string): Promise<any> {
    return await this.doFetch(N8N_WEBHOOKS.SQL_QUERY, {
      method: "POST",
      body: { query },
    });
  }

  public async submitNewRatatouilleChatMessage(message: string): Promise<{
    id: number;
    type: "ai";
    text: string;
    timestamp: string;
  }> {
    return await this.doFetch(N8N_WEBHOOKS.RATATOUILLE_CHAT, {
      method: "POST",
      body: { message },
    });
  }

  private async doFetch(
    url: string,
    options: { method: string; body: Object }
  ): Promise<any> {
    const response = await fetch(url, {
      ...options,
      body: JSON.stringify({
        ...options.body,
        projectKey: PROJECT_KEY,
        adminUserKey: this.getAdminUserKey(),
      }),
    });
    return response.json();
  }

  private getAdminUserKey(): string {
    const cookies = document.cookie.split("; ");
    const adminUserKeyCookie = cookies.find((cookie) =>
      cookie.startsWith("adminUserKey=")
    );
    console.log(adminUserKeyCookie);
    console.log(adminUserKeyCookie ? adminUserKeyCookie.split("=")[1] : "");
    return adminUserKeyCookie ? adminUserKeyCookie.split("=")[1] : "";
  }
}

export default new RatatouilleApi();