import { getEnvironmentVariable } from "@langchain/core/utils/env";
import { Tool } from "@langchain/core/tools";

/**
 * Interface for the parameters required to instantiate a GithubAPI
 * instance.
 */
export interface GitHubAPIParams {
  githubRepository?: string;
  githubAppId?: string;
  githubAppPrivateKey?: string;
  githubBranch?: string;
  githubBaseBranch?: string;
}

/**
 * Class for interacting with the GitHub REST API.
 * TODO: Add documentation.
 */
export class GithubAction extends Tool {
  static lc_name() {
    return "GithubAction";
  }

  name = "github-action";

  description =
    "Tool for interacting with the GitHub API.";

  githubRepository: string;
  githubAppId: string;
  githubAppPrivateKey: string;
  githubBranch?: string;
  githubBaseBranch?: string;

  constructor(
    fields: GitHubAPIParams = {
      githubRepository: getEnvironmentVariable("GITHUB_REPOSITORY"),
      githubAppId: getEnvironmentVariable("GITHUB_APP_ID"),
      githubAppPrivateKey: getEnvironmentVariable("GITHUB_APP_PRIVATE_KEY"),
    }
  ) {
    super();

    if (!fields.githubAppId) {
      throw new Error(
        `GitHub App ID not set. Please pass it in or set it as an environment variable named "GITHUB_APP_ID".`
      );
    }

    if (!fields.githubAppPrivateKey) {
      throw new Error(
        `GitHub App private key not set. Please pass it in or set it as an environment variable named "GITHUB_APP_PRIVATE_KEY".`
      );
    }

    if (!fields.githubRepository) {
      throw new Error(
        `GitHub repository not set. Please pass it in or set it as an environment variable named "GITHUB_REPOSITORY".`
      );
    }

    this.githubAppId = fields.githubAppId;
    this.githubAppPrivateKey = fields.githubAppPrivateKey;
    this.githubRepository = fields.githubRepository;
    this.githubBranch = fields.githubBranch;
    this.githubBaseBranch = fields.githubBaseBranch;
  }

  /** @ignore */
  async _call(input: string): Promise<string> {
    const headers = {
      "X-Subscription-Token": this.apiKey,
      Accept: "application/json",
    };
    const searchUrl = new URL(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
        input
      )}`
    );

    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const parsedResponse = await response.json();
    const webSearchResults = parsedResponse.web?.results;
    const finalResults = Array.isArray(webSearchResults)
      ? webSearchResults.map(
        (item: { title?: string; url?: string; description?: string }) => ({
          title: item.title,
          link: item.url,
          snippet: item.description,
        })
      )
      : [];
    return JSON.stringify(finalResults);
  }
}