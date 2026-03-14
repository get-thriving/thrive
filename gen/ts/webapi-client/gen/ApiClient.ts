/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { ApiKeyService } from './services/ApiKeyService';
import { ApplicationService } from './services/ApplicationService';
import { AuthService } from './services/AuthService';
import { BigPlansService } from './services/BigPlansService';
import { CalendarService } from './services/CalendarService';
import { ChoresService } from './services/ChoresService';
import { ContactsService } from './services/ContactsService';
import { DocsService } from './services/DocsService';
import { GcService } from './services/GcService';
import { GenService } from './services/GenService';
import { HabitsService } from './services/HabitsService';
import { HomeService } from './services/HomeService';
import { InboxTasksService } from './services/InboxTasksService';
import { JournalsService } from './services/JournalsService';
import { LifePlanService } from './services/LifePlanService';
import { McpKeyService } from './services/McpKeyService';
import { MetricsService } from './services/MetricsService';
import { MotdService } from './services/MotdService';
import { NotesService } from './services/NotesService';
import { PrmService } from './services/PrmService';
import { PushIntegrationsService } from './services/PushIntegrationsService';
import { ReportService } from './services/ReportService';
import { ScheduleService } from './services/ScheduleService';
import { SearchService } from './services/SearchService';
import { SmartListsService } from './services/SmartListsService';
import { StatsService } from './services/StatsService';
import { TagsService } from './services/TagsService';
import { TestHelperService } from './services/TestHelperService';
import { TimeEventsService } from './services/TimeEventsService';
import { TimePlansService } from './services/TimePlansService';
import { UsersService } from './services/UsersService';
import { VacationsService } from './services/VacationsService';
import { WorkingMemService } from './services/WorkingMemService';
import { WorkspacesService } from './services/WorkspacesService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
    public readonly apiKey: ApiKeyService;
    public readonly application: ApplicationService;
    public readonly auth: AuthService;
    public readonly bigPlans: BigPlansService;
    public readonly calendar: CalendarService;
    public readonly chores: ChoresService;
    public readonly contacts: ContactsService;
    public readonly docs: DocsService;
    public readonly gc: GcService;
    public readonly gen: GenService;
    public readonly habits: HabitsService;
    public readonly home: HomeService;
    public readonly inboxTasks: InboxTasksService;
    public readonly journals: JournalsService;
    public readonly lifePlan: LifePlanService;
    public readonly mcpKey: McpKeyService;
    public readonly metrics: MetricsService;
    public readonly motd: MotdService;
    public readonly notes: NotesService;
    public readonly prm: PrmService;
    public readonly pushIntegrations: PushIntegrationsService;
    public readonly report: ReportService;
    public readonly schedule: ScheduleService;
    public readonly search: SearchService;
    public readonly smartLists: SmartListsService;
    public readonly stats: StatsService;
    public readonly tags: TagsService;
    public readonly testHelper: TestHelperService;
    public readonly timeEvents: TimeEventsService;
    public readonly timePlans: TimePlansService;
    public readonly users: UsersService;
    public readonly vacations: VacationsService;
    public readonly workingMem: WorkingMemService;
    public readonly workspaces: WorkspacesService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.3.2',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.apiKey = new ApiKeyService(this.request);
        this.application = new ApplicationService(this.request);
        this.auth = new AuthService(this.request);
        this.bigPlans = new BigPlansService(this.request);
        this.calendar = new CalendarService(this.request);
        this.chores = new ChoresService(this.request);
        this.contacts = new ContactsService(this.request);
        this.docs = new DocsService(this.request);
        this.gc = new GcService(this.request);
        this.gen = new GenService(this.request);
        this.habits = new HabitsService(this.request);
        this.home = new HomeService(this.request);
        this.inboxTasks = new InboxTasksService(this.request);
        this.journals = new JournalsService(this.request);
        this.lifePlan = new LifePlanService(this.request);
        this.mcpKey = new McpKeyService(this.request);
        this.metrics = new MetricsService(this.request);
        this.motd = new MotdService(this.request);
        this.notes = new NotesService(this.request);
        this.prm = new PrmService(this.request);
        this.pushIntegrations = new PushIntegrationsService(this.request);
        this.report = new ReportService(this.request);
        this.schedule = new ScheduleService(this.request);
        this.search = new SearchService(this.request);
        this.smartLists = new SmartListsService(this.request);
        this.stats = new StatsService(this.request);
        this.tags = new TagsService(this.request);
        this.testHelper = new TestHelperService(this.request);
        this.timeEvents = new TimeEventsService(this.request);
        this.timePlans = new TimePlansService(this.request);
        this.users = new UsersService(this.request);
        this.vacations = new VacationsService(this.request);
        this.workingMem = new WorkingMemService(this.request);
        this.workspaces = new WorkspacesService(this.request);
    }
}

