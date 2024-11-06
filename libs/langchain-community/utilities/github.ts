import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { getEnvironmentVariable } from "@langchain/core/utils/env";

interface GitHubConfig {
  githubRepository?: string;
  githubAppId?: string;
  githubAppPrivateKey?: string;
  activeBranch?: string;
  githubBaseBranch?: string;
}

export class GitHubAPIWrapper {
  github: Octokit | null;
  githubRepository?: string;
  githubAppId?: string;
  githubAppPrivateKey?: string;
  activeBranch?: string;
  githubBaseBranch?: string;

  constructor(
    config: GitHubConfig = {
      githubRepository: getEnvironmentVariable("GITHUB_REPOSITORY"),
      githubAppId: getEnvironmentVariable("GITHUB_APP_ID"),
      githubAppPrivateKey: getEnvironmentVariable("GITHUB_APP_PRIVATE_KEY"),
    }
  ) {
    if (!config.githubAppId) {
      throw new Error(
        `GitHub App ID not set. Please pass it in or set it as an environment variable named "GITHUB_APP_ID".`
      );
    }

    if (!config.githubAppPrivateKey) {
      throw new Error(
        `GitHub App private key not set. Please pass it in or set it as an environment variable named "GITHUB_APP_PRIVATE_KEY".`
      );
    }

    if (!config.githubRepository) {
      throw new Error(
        `GitHub repository not set. Please pass it in or set it as an environment variable named "GITHUB_REPOSITORY".`
      );
    }

    this.githubAppId = config.githubAppId;
    this.githubAppPrivateKey = config.githubAppPrivateKey;
    this.githubRepository = config.githubRepository;
    this.activeBranch = config.activeBranch;
    this.githubBaseBranch = config.githubBaseBranch;
  }
}
